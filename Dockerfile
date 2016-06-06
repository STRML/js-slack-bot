# a Node.js application container including ContainerPilot
FROM mhart/alpine-node:6.2.1

# install deps & copy
COPY package.json .token /opt/bot/
RUN cd /opt/bot && npm install

# Add last so we can avoid reinstall
COPY index.js /opt/bot

ENV NODE_ENV '/opt/bot/'

CMD [ "node", \
      "/opt/bot/index.js" \
]
