the specs are based on [jasmine-node](https://github.com/mhevery/jasmine-node)

In order to run specs:

1. install jasmine-node with:

        npm install jasmine-node

2. install websocket-client
        
        npm install websocket-client

3. install nowclient
        
        git clone https://github.com/Flotype/nowclient.git
        cd nowclient
        npm install -g
        npm link nowclient (from backbone-nowjs folder)

4. run specs (from backbone-nowjs root folder) with:

        jasmine-node spec
