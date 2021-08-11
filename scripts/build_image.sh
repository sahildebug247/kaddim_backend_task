cp /home/ubuntu/codebase/production.env ./env/production.env
docker build -t linkedin-backend -f ./docker/linkedin-backend.Dockerfile .