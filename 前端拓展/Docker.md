## 启动Docker容器

```bash
 docker run -d -p 80:80 docker/getting-started
```

* `-d` - 在后台运行一个容器
* `-p 80:80` -将主机 80 端口映射到容器 80 端口
* `docker/getting-started` - 使用 `docker` 镜像

此时 docker 会自动下载 `docker/getting-started`这个镜像。

当下载完成，会提示：

```bash
Status: Downloaded newer image for docker/getting-started:latest
e0533a336bed84cb6bdff016e36116b86c5beccbfc86f3d1283f069b55f2d91e
```

现在打开`Docker` 桌面面板，我们能够可视化地看到机器上已经运行的容器。

容器会随机取一个名字：

![Tutorial container running in Docker Dashboard](https://docs.docker.com/get-started/images/tutorial-in-dashboard.png)

## 容器是什么

简单来说，容器（container）是我们的计算机上的一个进程，已与主机上的所有其他进程隔离。

容器的特点：

1. 是一个镜像（image）的可运行实例。我们可以创建、启动、停止、移动或者删除容器
2. 可以运行在本地机、虚拟机或者部署到云上。
3. 可移植的，能够被任何操作系统运行
4. 容器之间互相隔离，运行他们自己的软件、二进制文件和配置

## 镜像是什么

当运行一个容器时，它会使用一个隔离的文件系统。这个自定义的文件系统是容器镜像（image）提供的。因为镜像包含了容器的文件系统，所以它必须包含运行应用程序所需的所有东西——所有依赖项、配置、脚本、二进制文件等等。该映像还包含容器的其他配置，例如环境变量、要运行的默认命令和其他元数据。

使用以下命令行可以查看镜像列表

```bash
docker image ls
```

当然，也可以通过 `docker` 桌面端查看。

## 应用程序示例

下面使用容器来运行一个本地应用程序。

1. 下载[代码](https://github.com/docker/getting-started/tree/master/app)

2. 用 `vscode` 打开

3. 在根目录下创建 `Dockerfile` 文件并写入：

   ```dockerfile
   # syntax=docker/dockerfile:1
   FROM node:12-alpine
   RUN apk add --no-cache python2 g++ make
   WORKDIR /app
   COPY . .
   RUN yarn install --production
   CMD ["node", "src/index.js"]
   EXPOSE 3000
   ```

   需要注意不能有扩展名

4. 打开项目终端，运行：

   ```js
    docker build -t getting-started .
   ```

   `-t`标记我们的镜像，我们命名了`getting-started`这个镜像名，我们可以在运行容器时引用这个镜像。

   `.`在docker构建命令的末尾，告诉`docker`应该在当前目录中查找`Dockerfile`。

   这个命令会根据 Dockerfile 来创建一个新的容器映像。此时会做以下事情：

   * 我们会下载从`node:12-alpine`开始的镜像。

   * 下载完后，会从`..`目录开始拷贝`/app`文件夹，
   * 然后执行`yarn install --production`
   * 最后运行 CMD 命令` node src/index.js`

5. 运行命令：

   ```bash
   docker run -dp 3000:3000 getting-started
   ```

   `-dp`是`-d -p`的缩写，意思是在后台运行一个镜像，镜像名为`getting-started`,我们需要让主机的 `3000`端口映射到镜像的`3000`端口。

6. 最后在浏览器上打开`localhost:3000`就能够看到我们的 `app` 了。

   ![Empty Todo List](https://docs.docker.com/get-started/images/todo-list-empty.png)

此时打开 Docker，会看到有两个镜像启动了。

![Docker Dashboard with tutorial and app containers running](https://docs.docker.com/get-started/images/dashboard-two-containers.png)

## 更新应用

现在我们需要更新一下代码，在 `src/static/js/app.js`上更新以下代码：

```diff
- <p className="text-center">No items yet! Add one above!</p>
+ <p className="text-center">You have no todo items yet! Add one above!</p>
```

然后运行以下命令：

```bash
docker build -t getting-started .
docker run -dp 3000:3000 getting-started
```

会报一个错：

```bash
docker: Error response from daemon: driver failed programming external connectivity on endpoint epic_gould (3799c6f242a473e0057eaeb958ea129d03142acd9da927049e5eb041ce198218): Bind for 0.0.0.0:3000 failed: port is already allocated.
```

我们无法启动新容器，因为旧容器仍在运行。这是因为容器正在使用主机的端口3000，并且机器上只有一个进程(包括容器)可以侦听特定的端口。要解决这个问题，我们需要移除旧容器。

## 移除旧容器

查看哪些容器正在运行：

```bash
docker ps
```

停止容器运行

```bash
docker stop <the-container-id>
```

删除容器

```bash
docker rm <the-container-id>
```

当然，也可以在 docker 面板上面删除容器

![Docker Dashboard - removing a container](https://docs.docker.com/get-started/images/dashboard-removing-container.png)

此时再用容器启动镜像：

```bash
docker run -dp 3000:3000 getting-started
```

重新打开`localhost:3000`就能够看到新的应用程序了。

但这样有一个问题，那就是我们原来的容器被删除了，`docker` 容器消失意味着里面所有的数据都会消失。

如果我们不想要每次更改后都重新构建以及启动新容器即可查看代码更新，我们需要学习`docker`持久化。

在这之前，我们需要先学习共享应用（share application）。

## 共享应用

使用共享应用（share application）需要注册并登陆 [Docker Hub](https://hub.docker.com/)

然后将本地镜像推送到`Docker Hub`

步骤：

1. 使用命令行登陆`Docker Hub`

   ```bash
   docker login -u YOUR-USER-NAME
   ```

2. 使用该`docker tag`命令为镜像指定一个新名称。请务必使用 `YOUR-USER-NAME`您的 Docker ID 进行替换。

   ```bash
   docker tag <image name> YOUR-USER-NAME/<image name>
   ```

   例如，我现在有一个叫 `gs` 的镜像,我取名：

   ```bash
   docker tag gs qiuyanxi/gs
   ```

3. 推送到远程

   ```bash
   docker push qiuyanxi/gs
   ```

   等待片刻，`Docker Hub` 就会生成`qiuyanxi/gs`这个仓库，然后将镜像包推到这个仓库里。

当这样操作之后，我们就能够用[play with Docker](https://labs.play-with-docker.com/)来运行我们的镜像。

1. 打开[play with Docker](https://labs.play-with-docker.com/)

2. 用 `docker`账号登陆并连接 `Docker Hub`

3. 点击**ADD NEW INSTANCE**

4. 在终端命令行中输入

   ```bash
   docker run -dp 3000:3000 YOUR-USER-NAME/<repository name>
   ```

   例如：

   ```bash
   docker run -dp 3000:3000 qiuyanxi/gs
   ```

5. 最后会运行镜像，此时我们也可以通过`localhost:3000`来看到应用

   ![Play with Docker add new instance](https://docs.docker.com/get-started/images/pwd-add-new-instance.png)







