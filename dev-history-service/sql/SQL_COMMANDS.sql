CREATE TABLE IF NOT EXISTS logs(
	id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
	service VARCHAR NOT NULL,
	tag VARCHAR,
	message VARCHAR,
    inserted_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	created_on TIMESTAMP
);

INSERT INTO logs (user_id, service, tag, message, created_on)
VALUES ('1', 'service-plotting', 'plotting-service', 'Message from plotting service', (SELECT TO_TIMESTAMP(	'2017-03-31 09:30:20',
    																										'YYYY-MM-DD HH:MI:SS')) )
RETURNING id


INSERT INTO logs (user_id, service, tag, message, created_on)
VALUES ($1, $2, $3, $4, $5)
RETURNING id

SELECT *
FROM logs
WHERE user_id = $1 AND service = "plotting-service"


