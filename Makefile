.PHONY: dev prod down clean logs setup setup-prod

# Run Prisma migration and seeder inside the container (Development Mode)
setup:
	@echo "Running Development database migration..."
	docker exec -it authforge-dev npx prisma migrate dev

# Run Prisma migration on VPS (Production Mode)
setup-prod:
	@echo "Running Production database migration..."
	docker compose --profile dev run --rm dev npx prisma migrate deploy

# Start development mode (Hot-Reload)
dev:
	@echo "Starting Development mode..."
	docker compose --profile dev up --build

# Start production mode in background (-d)
prod:
	@echo "Starting Production mode..."
	docker compose --profile prod up -d --build

# Stop all running containers
down:
	@echo "Stopping containers..."
	docker compose --profile dev --profile prod down

# View logs from production mode
logs:
	docker compose --profile prod logs -f

# Stop and clean up Docker containers, volumes, and cache
clean:
	@echo "Cleaning up containers, volumes, and cache..."
	docker compose --profile dev --profile prod down -v
	docker system prune -f
