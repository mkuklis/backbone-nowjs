(function(){

  // Todo
  window.Todo = Backbone.Model.extend({
    toggle: function() {
      this.save({done: !this.get("done")});
    },

    clear: function() {
      this.destroy();
      $(this.view.el).remove();
    }
  });

  // Todo List
  window.TodoList = Backbone.Collection.extend({
    url: "/todos",
    model: Todo,

    // Returns all done todos.
    done: function() {
      return this.filter(function(todo){
        return todo.get('done');
      });
    },

    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    },

    comparator: function(todo) {
      return todo.get('order');
    },

    pluralize: function(count) {
      return count == 1 ? 'item' : 'items';
    }

  });

  window.Todos = new TodoList;

  window.TodoView = Backbone.View.extend({

    tagName: "li",
    className: "todo",

    template: _.template("<input type='checkbox' class='todo-check' /><div class='todo-content'></div><span class='todo-destroy'></span><input type='text' class='todo-input' />"),

    events: {
      "click .todo-check"      : "toggleDone",
      "dblclick .todo-content" : "edit",
      "click .todo-destroy"    : "clear",
      "keypress .todo-input"   : "updateOnEnter"
    },

    initialize: function() {
      _.bindAll(this, 'render', 'close');
      this.model.bind('change', this.render);
      this.model.view = this;
    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      $(this.el).attr("id", "todo-"+this.model.id);
      this.setContent();
      //sortableTodos.addItems(this.el);
      return this;
    },

    setContent: function() {
      var content = this.model.get('content');
      this.$('.todo-content').html(content);
      this.$('.todo-input').val(content);

      if (this.model.get('done')) {
        this.$(".todo-check").attr("checked", "checked");
        $(this.el).addClass("done");
      } else {
        this.$(".todo-check").removeAttr("checked");
        $(this.el).removeClass("done");
      }

      this.input = this.$(".todo-input");
      //this.input.addEvent('blur', this.close);
    },

    toggleDone: function() {
      this.model.toggle();
    },

    edit: function() {
      $(this.el).addClass("editing");
      this.input.focus();
    },

    close: function() {
      this.model.save({content: this.input.getProperty("value")});
      $(this.el).removeClass("editing");
    },

    updateOnEnter: function(e) {
      if (e.code == 13) this.close();
    },

    clear: function() {
      this.model.clear();
    }
  });
/*
  var sortableTodos = new Sortables("todo-list", {
    constrain: true,
    clone: true,
    handle: ".todo-content",
    onComplete: function(ele){
      sortableTodos.serialize(false, function(element, index){
        todo = Todos.get(element.getProperty("id").replace("todo-", ""));
        todo.save({"order": index});
      });
    }
  });
*/
  window.AppView = Backbone.View.extend({

    el: $("#todoapp"),
    statsTemplate: _.template('<% if (total) { %><span class="todo-count"><span class="number"><%= remaining %></span><span class="word"> <%= remaining == 1 ? "item" : "items" %></span> left.</span><% } %><% if (done) { %><span class="todo-clear"><a href="#">Clear <span class="number-done"><%= done %> </span>completed <span class="word-done"><%= done == 1 ? "item" : "items" %></span></a></span><% } %>'),

    events: {
      "keydown #new-todo"  : "createOnEnter",
      "keyup #new-todo"    : "showTooltip",
      "click .todo-clear"  : "clearCompleted"
    },

    initialize: function() {
      _.bindAll(this, 'addOne', 'addAll', 'render');

      this.input = this.$("#new-todo");

      Todos.bind('add',     this.addOne);
      Todos.bind('reset', this.addAll);
      Todos.bind('all',     this.render);
      Todos.fetch();
    },

    render: function() {
      var done = Todos.done().length;
      this.$("#todo-stats").html(this.statsTemplate({
        done:       done,
        total:      Todos.length,
        remaining:  Todos.length - done
      }));
    },

    addOne: function(todo) {
      var view = new TodoView({model: todo}).render().el;
      this.$("#todo-list").append(view);
    },

    addAll: function() {
      Todos.each(this.addOne);
    },

    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      Todos.create({
        content: this.input.val(),
        done:    false
      });
      this.input.val("");
    },

    showTooltip: function(e) {
      var tooltip = this.$(".ui-tooltip-top");
      tooltip.fadeOut();

      if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
      if (this.input.val() !== "" && this.input.val() !== this.input.attr("placeholder")) {
        this.tooltipTimeout = setTimeout(function(){
          tooltip.fadeIn();
        }, 1000);
      }
    },

    clearCompleted: function() {
      _.each(Todos.done(), function(todo){ todo.clear(); });
      return false;
    }
  });

  $(function () {
    now.ready(function () {
      window.App = new AppView;
    });
  });
}());
