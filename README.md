# FlightKit install

Requirements:
- vagrant
- mysql
- php 7.0

cd Code
git clone https://github.com/gdmgent/dotfiles
paste project in Code map
cd FlightKit
edit Artestead.yaml
composer install
cd www
composer install
composer update
npm install
npm update
copy .env.example to .env
change database settings
cd ..
vagrant up —provision
vagrant ssh
cd FlightKit/www
php artisan make:console ArteveldeDatabaseInit
php artisan migrate
php artisan db:seed
php artisan cache:clear
php artisan route:clear
php artisan optimize
php artisan key:generate


To enable login with facebook
- go to facebook developers page
- request client_id and client_secret
- declare local project url on the page and save
- add both client string in www/config/services.php
