# Shortcuts for the Docker stack. Everything works with plain `docker compose` too.
COMPOSE := docker compose

.PHONY: all up down logs ps db clean re

all: up

# First run: create .env from the example so the stack can start
.env:
	cp .env.example .env
	@echo "Created .env from .env.example: change the passwords before sharing anything."

up: .env ## Build and start everything in the background
	$(COMPOSE) up --build --detach
	@echo "Ready: https://localhost:8443 (or the HTTPS_PORT set in .env)"

down: ## Stop and remove the containers (data is kept)
	$(COMPOSE) down

logs: ## Follow the logs of every service
	$(COMPOSE) logs --follow

ps: ## Show the services and their health
	$(COMPOSE) ps

db: .env ## Start only the database, for local development with pnpm dev
	$(COMPOSE) up --detach db

clean: ## Stop everything and delete the volumes: database data and certificate
	$(COMPOSE) down --volumes --remove-orphans

re: clean up