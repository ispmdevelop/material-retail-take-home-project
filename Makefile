.PHONY: dev build build-api seed up down install

UI_DIR := ui
API_DIR := api
PUBLIC_DIR := api/public

dev:
	@echo "Starting API in dev mode..."
	@cd $(API_DIR) && npm run start:dev &
	@echo "Starting UI in dev mode..."
	@cd $(UI_DIR) && npm run dev

build:
	@echo "Building UI..."
	@cd $(UI_DIR) && npm run build
	@rm -rf $(PUBLIC_DIR)
	@mkdir -p $(PUBLIC_DIR)
	@cp -r $(UI_DIR)/dist/* $(PUBLIC_DIR)/
	@echo "UI built and copied to $(PUBLIC_DIR)"

build-api:
	@echo "Building API..."
	@cd $(API_DIR) && npm run build

seed:
	@cd $(API_DIR) && npm run seed

up:
	@docker compose up -d

down:
	@docker compose down -v

install:
	@cd $(UI_DIR) && npm install
	@cd $(API_DIR) && npm install
	@cd $(API_DIR) && npx prisma generate
