FROM node
WORKDIR /frontend
COPY ./frontend/package.json .
RUN npm i
COPY ./frontend .
RUN npm run build

FROM rustlang/rust:nightly
WORKDIR /backend
RUN echo "fn main() {}" > dummy.rs
COPY ./backend/Cargo.toml .
RUN sed -i 's#src/main.rs#dummy.rs#' Cargo.toml
RUN cargo build --release
RUN sed -i 's#dummy.rs#src/main.rs#' Cargo.toml
COPY ./backend .
COPY --from=0 ./frontend/dist ./dist
RUN cargo build --release

EXPOSE 80
ENV ROCKET_PORT=80
ENV ROCKET_ADDRESS=0.0.0.0
CMD ["./target/release/subjective-assembly"]
