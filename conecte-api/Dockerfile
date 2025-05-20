FROM node:20

WORKDIR /app

COPY . .

RUN npm install
RUN npx prisma generate
RUN npm run build

COPY entrypoint.sh .

RUN chmod +x entrypoint.sh

EXPOSE 3000

CMD ["./entrypoint.sh"]
