# a Node.js application container including ContainerPilot
FROM mhart/alpine-node:6.2.1

# install deps & copy
COPY package.json index.js .token /opt/bot/
RUN cd /opt/bot && npm install

LABEL com.joyent.package=g4-highcpu-128M

CMD [ "node", \
      "/opt/bot/index.js" \
]
