# Docker commands to run this locally ... 
1. Start up a docker quickstart terminal
2. Switch to the directory which contains the Dockerfile
3. Build the image

    ```
    $ docker build -t APP_OCA_RA/recipesui .
    ```
4. Run the image in a container in detached mode mapping the container's port 80 to the host's port 8000. Name it "recipesui"

    ```
    $ docker run --name recipesui -d -p 8000:80 APP_OCA_RA/recipesui
    ```
5. Determine the host IP assigned to the virtual machine running the docker host.

    ```
    $ docker-machine ls
    NAME      ACTIVE   DRIVER       STATE     URL                         SWARM
    default   *        virtualbox   Running   tcp://192.168.99.100:2376
    ```
6. Open a browser to the IP in the URL from the previous command. Example:

    ```
    http://192.168.99.100:80
    ```
7. You should see the recipes ui application.

## Making changes to the recipes ui app

1. You'll need to rebuild. There might be a better way to do this, but I do ...

    ```
    $ docker stop recipesui
    ```
2. Remove it...

    ```
    $ docker rm recipesui
    ```
3. Follow the steps above to rebuild and re-run.

