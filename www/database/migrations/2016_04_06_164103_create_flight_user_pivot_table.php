<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFlightUserPivotTable extends Migration
{
    // Laravel Eloquent ORM expects lowercase model names in alphabetical order!
    const TABLE = CreateFlightsTable::MODEL.'_'.CreateUsersTable::MODEL;
    const PRIMARY_KEY = [
        CreateFlightsTable::FOREIGN_KEY,
        CreateUsersTable::FOREIGN_KEY,
    ];

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(self::TABLE, function (Blueprint $table) {
            // Primary Key (Composite Key)
            foreach (self::PRIMARY_KEY as $column) {
                $table->unsignedInteger($column);
            }
            $table->primary(self::PRIMARY_KEY);

            // Foreign Keys
            $table->foreign(CreateFlightsTable::FOREIGN_KEY)
                ->references(CreateFlightsTable::PRIMARY_KEY)
                ->on(CreateFlightsTable::TABLE)
                ->onDelete('cascade');
            $table->foreign(CreateUsersTable::FOREIGN_KEY)
                ->references(CreateUsersTable::PRIMARY_KEY)
                ->on(CreateUsersTable::TABLE)
                ->onDelete('cascade');
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
