FROM ubuntu:22.04

USER root

RUN apt-get update && apt-get install -y supervisor
RUN mkdir -p /var/log/supervisor

RUN apt install -y net-tools git less vim npm python3-pip libasound2 libgbm-dev libnss3
RUN apt install -y curl gnupg

# RUN apt --fix-broken install
# RUN apt update
# RUN apt remove nodejs nodejs-doc
# RUN dpkg --remove --force-remove-reinstreq nodejs-do
# RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt install -y nodejs

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN mkdir -p /rl-leaderboard
RUN mkdir -p /rl-leaderboard/logs

WORKDIR /rl-leaderboard

COPY package*.json /rl-leaderboard/
COPY requirements.txt /rl-leaderboard/
RUN npm install
RUN pip3 install -r requirements.txt

RUN mkdir -p /rl-leaderboard/server
RUN mkdir -p /rl-leaderboard/src
RUN mkdir -p /rl-leaderboard/public
COPY server/ /rl-leaderboard/server
COPY src/ /rl-leaderboard/src
COPY public/ /rl-leaderboard/public

RUN npm run build

EXPOSE 8080
EXPOSE 5000

CMD ["/usr/bin/supervisord"]