<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFlightsTable extends Migration
{
    const MODEL = 'flight';
    const TABLE = self::MODEL.'s';
    const PRIMARY_KEY = 'id';
    const FOREIGN_KEY = self::MODEL.'_'.self::PRIMARY_KEY;

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(self::TABLE, function (Blueprint $table) {
            // Data
            $table->increments(self::PRIMARY_KEY);

//            $table->unsignedInteger(CreateUsersTable::FOREIGN_KEY);
//            $table->foreign(CreateUsersTable::FOREIGN_KEY)
//                ->references(CreateUsersTable::PRIMARY_KEY)
//                ->on(CreateUsersTable::TABLE)
//                ->onDelete('cascade');

            $table->string('airline');
            $table->integer('number');
            $table->date('day');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop(self::TABLE);
    }
}
