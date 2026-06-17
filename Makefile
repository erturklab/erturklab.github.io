.PHONY: dev stop restart logs shell clean sync-deps sync-assets build

dev:
	docker compose up --build -d
	@echo "✓ Ertürk Lab site running at http://localhost:3001"

stop:
	docker compose down

restart:
	docker compose up -d --force-recreate
	@echo "✓ Reloaded environment — open http://localhost:3001"

build:
	docker compose run --rm -e NODE_ENV=production web sh -c "npm run build"
	@echo "✓ Static export built in ./out/"

logs:
	docker compose logs -f web

shell:
	docker compose exec web sh

clean:
	docker compose down -v --rmi local

# Copy node_modules from Docker volume so the IDE stops showing false TypeScript errors
sync-deps:
	@mkdir -p node_modules
	docker run --rm -v erturk-lab-web_node_modules:/src -v "$(CURDIR)/node_modules:/dest" alpine sh -c 'cp -a /src/. /dest/'
	@echo "✓ node_modules synced — reload the editor window if red squiggles remain"

.PHONY: dev stop restart logs shell clean sync-deps sync-assets build

# Re-download images from legacy erturk-lab.com into public/images/ (only needed once or when adding new assets)
sync-assets:
	bash scripts/sync-assets.sh
