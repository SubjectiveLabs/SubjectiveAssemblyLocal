FROM node
COPY ./frontend /frontend
WORKDIR /frontend
RUN npm i
RUN npm run build

FROM rustlang/rust:nightly
COPY ./backend ./backend
WORKDIR /backend
COPY --from=0 ./frontend/dist ./dist
RUN cargo build --release

EXPOSE 80
ENV ROCKET_PORT=80
ENV ROCKET_ADDRESS=0.0.0.0
CMD ["./target/release/subjective-assembly"]
