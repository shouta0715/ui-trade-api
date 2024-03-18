up:
	supabase start -x realtime,storage-api,inbucket  && docker compose up -d

down:
	supabase stop && docker compose down

reset:
	supabase db start
	supabase db reset
	docker volume rm ui-trade_minio
	rm -rf .next
	

.PHONY: up down reset