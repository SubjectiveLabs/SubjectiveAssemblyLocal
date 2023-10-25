npm --prefix frontend i && npm --prefix frontend run build &&
rm -rf backend/dist && cp -r frontend/dist backend/ && cd backend && ROCKET_ADDRESS=0.0.0.0 ROCKET_PORT=80 cargo run --release && cd ..
