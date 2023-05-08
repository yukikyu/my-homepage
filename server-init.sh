# 安装acme
curl https://get.acme.sh | sh -s email=zynifff@gmail.com

# ali dns代理授权
export Ali_Key=""
export Ali_Secret=""

# 申请证书
./acme.sh --issue --dns dns_ali --dnssleep 60 -d yukikyu.com -d *.yukikyu.com --debug

# 登录docker
sudo docker login --username=17333255246 registry.cn-shanghai.aliyuncs.com

# 下载镜像、启动容器
# docker run --name yukikyu-homepage  -p 80:80 -p 443:443 -v /root/.acme.sh/yukikyu.com:/etc/nginx/ssl/yukikyu.com registry.cn-hangzhou.aliyuncs.com/yukikyu-namespace/yukikyu-homepage:v1.0.0
docker run --name yukikyu-homepage  -p 80:80 -p 443:443 -v /root/.acme.sh/yukikyu.com_ecc:/etc/nginx/ssl/yukikyu.com registry.cn-hangzhou.aliyuncs.com/yukikyu-namespace/yukikyu-homepage:v1.0.0