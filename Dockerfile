# a Node.js application container including ContainerPilot
FROM mhart/alpine-node:6.2.1

# install deps & copy
WORKDIR /opt/bot
COPY package.json .token ./
RUN npm install

# Add last so we can avoid reinstall
COPY index.js .

CMD [ "node", \
      "index.js" \
]
