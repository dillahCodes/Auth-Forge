.PHONY: setup dev dev-down build build-app build-migration push push-app push-migration pull pull-app pull-migration migrate start prod-down show

# ==========================================
# CONFIGURATION / VARIABLES
# ==========================================
USERNAME ?= dillahcodes
TAG ?= latest

APP_IMAGE = $(USERNAME)/authforge:$(TAG)
MIGRATION_IMAGE = $(USERNAME)/authforge-migration:$(TAG)

# ==========================================
# DEVELOPMENT
# ==========================================

# Start development environment
dev:
	@echo "Starting Development environment..."
	docker compose --profile dev up -d

# Initialize development database
setup:
	@echo "Starting Development environment..."
	docker compose --profile dev up -d

	@echo "Running Prisma migrations..."
	docker exec -it authforge-dev npx prisma migrate dev

	@echo "Running database seeder..."
	docker exec -it authforge-dev npx prisma db seed

# Stop development environment
dev-down:
	@echo "Stopping Development environment..."
	docker compose --profile dev down

# ==========================================
# CI/CD - BUILD & RELEASE (DOCKER HUB)
# ==========================================

# Build all production images
build: build-app build-migration

# Build main application image
build-app:
	@echo "Building application image: $(APP_IMAGE)..."
	docker build --target prod -t $(APP_IMAGE) .

# Build migration image
build-migration:
	@echo "Building migration image: $(MIGRATION_IMAGE)..."
	docker build --target migration -t $(MIGRATION_IMAGE) .

# Push all images to Docker Hub
push: push-app push-migration

# Push main application image
push-app:
	@echo "Pushing application image to Docker Hub: $(APP_IMAGE)..."
	docker push $(APP_IMAGE)

# Push migration image
push-migration:
	@echo "Pushing migration image to Docker Hub: $(MIGRATION_IMAGE)..."
	docker push $(MIGRATION_IMAGE)

# Pull all latest images (server)
pull: pull-app pull-migration

# Pull main application image
pull-app:
	@echo "Pulling application image: $(APP_IMAGE)..."
	docker pull $(APP_IMAGE)

# Pull migration image
pull-migration:
	@echo "Pulling migration image: $(MIGRATION_IMAGE)..."
	docker pull $(MIGRATION_IMAGE)

# ==========================================
# PRODUCTION DEPLOYMENT
# ==========================================

# Run database migration manually
# (auto-removes container on finish)
migrate:
	@echo "Running Database Migration..."
	docker compose run --rm migration

# Start production environment
# (auto-runs migration init-container, then auto-removes it on success)
start:
	@echo "Starting Production environment..."
	docker compose --profile prod up -d
	@echo "Removing migration container..."
	@docker rm authforge-migration

# Show Production containers
show:
	@echo "Showing Production containers..."
	docker ps -s --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Size}}"

# Stop production application
prod-down:
	@echo "Stopping Production environment..."
	docker compose --profile prod down