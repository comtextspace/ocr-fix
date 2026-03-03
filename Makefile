.PHONY: install lint test test-watch test-coverage clean publish help

help: ## Показать список команд
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

install: ## Установить зависимости
	yarn install

lint: ## Проверить код линтером
	yarn lint

test: ## Запустить тесты
	yarn test

test-watch: ## Тесты в режиме наблюдения (перезапуск при изменениях)
	yarn test:watch

test-coverage: ## Тесты с отчётом о покрытии
	yarn test:coverage

publish: ## Запустить тесты и опубликовать пакет на npm
	yarn test && yarn publish

clean: ## Удалить node_modules и coverage
	rm -rf node_modules coverage
