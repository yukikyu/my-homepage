IF [%~1] == [] (
    @echo 'Please enter the version number'
) else (
    docker build -t yukikyu-homepage:%~1 .
    :: docker login --username=17333255246 registry.cn-hangzhou.aliyuncs.com
    docker tag yukikyu-homepage:%~1 registry.cn-hangzhou.aliyuncs.com/yukikyu-namespace/yukikyu-homepage:%~1
    docker push registry.cn-hangzhou.aliyuncs.com/yukikyu-namespace/yukikyu-homepage:%~1
)