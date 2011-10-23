(function(){

  // Todo
  window.Todo = Backbone.Model.extend({

    defaults: function() {
      return {
        done:  false,
        order: Todos.nextOrder()
      };
    },

    toggle: function() {
      this.save({done: !this.get("done")});
    },

    clear: function() {
      this.destroy();
    }
  });

  // Todo List
  window.TodoList = Backbone.Collection.extend({
    backend: "todos",
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
      _.bindAll(this, 'render', 'close', 'remove');
      this.model.bind('change', this.render);
      this.model.bind("remove", this.remove);
      this.model.view = this;
    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      $(this.el).attr("id", "todo-" + this.model.id);
      this.setContent();
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
      this.input.blur(this.close);
    },

    toggleDone: function() {
      this.model.toggle();
    },

    edit: function() {
      $(this.el).addClass("editing");
      this.input.focus();
    },

    close: function() {
      this.model.save({content: this.input.val()});
      $(this.el).removeClass("editing");
    },

    updateOnEnter: function(e) {
      if (e.code == 13) this.close();
    },

    clear: function() {
      this.model.clear();
    },

    remove: function() {
      $(this.el).remove();
    }
  });

  window.AppView = Backbone.View.extend({

    el: $("#todoapp"),
    statsTemplate: _.template('<% if (total) { %><span class="todo-count"><span class="number"><%= remaining %></span><span class="word"> <%= remaining == 1 ? "item" : "items" %></span> left.</span><% } %><% if (done) { %><span class="todo-clear"><a href="#">Clear <span class="number-done"><%= done %> </span>completed <span class="word-done"><%= done == 1 ? "item" : "items" %></span></a></span><% } %>'),

    events: {
      "keydown #new-todo"  : "createOnEnter",
      "keyup #new-todo"    : "showTooltip",
      "click .todo-clear"  : "clearCompleted"
    },

    initialize: function() {
      _.bindAll(this, 'addOne', 'addAll', 'render', 'order');

      this.input = this.$("#new-todo");

      this.order = _.throttle(this.order, 300);

      Todos.bind('add',     this.addOne);
      Todos.bind('reset', this.addAll);
      Todos.bind('all',     this.render);
      Todos.bind('change:order', this.order);
      Todos.bind("error", function () {
      });

      // setup sortable
      $("#todo-list").sortable({
        update: function (e, ui) {
          orders =$(this).sortable('serialize').replace(/todo\[\]=/g, "").split('&');
          _(orders).each(function (order, index) {
            var todo = Todos.get(order);
            todo.save({"order": index}, {notify: "others"});
          });
        }
      });

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

    order: function () {
      Todos.fetch();
    },

    addOne: function(todo) {
      var view = new TodoView({model: todo}).render().el;
      this.$("#todo-list").append(view);
    },

    addAll: function() {
      this.$("#todo-list").empty();
      Todos.each(this.addOne);
    },

    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      Todos.create({
        content: this.input.val(),
        done: false
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
      now.core.socketio.on("reconnect", function () {
        window.location.reload();
      });

      now.core.socketio.on("disconnect", function () {
        $('#message').fadeIn();
      });

      window.App = new AppView;
    });
  });
}());
