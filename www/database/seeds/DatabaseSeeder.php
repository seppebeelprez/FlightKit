<?php

use Illuminate\Database\Seeder;
use App\Role;
use App\Trip;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Role::create(array(
          'name' => "admin"
        ));

        Role::create(array(
          'name' => "user"
        ));
    }
}
