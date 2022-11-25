IF [%~1] == [] (
    @echo 'Please enter the version number'
) else (
    docker pull nginx
    docker build -t yukikyu-homepage:%~1 .
    :: docker login --username=17333255246 registry.cn-hangzhou.aliyuncs.com
    docker tag yukikyu-homepage:%~1 registry.cn-hangzhou.aliyuncs.com/yukikyu-namespace/yukikyu-homepage:%~1
    docker push registry.cn-hangzhou.aliyuncs.com/yukikyu-namespace/yukikyu-homepage:%~1
)
:: 停止、删除所有容器和镜像
@ECHO OFF
FOR /f "tokens=*" %%i IN ('docker ps -q') DO docker stop %%i
FOR /f "tokens=*" %%i IN ('docker ps -aq') DO docker rm %%i
FOR /f "tokens=*" %%i IN ('docker images -aq') DO docker rmi %%i