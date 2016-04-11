<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

/**
 * Class ArteveldeDatabaseDrop.
 *
 * Use:
 * $ php artisan artevelde:database:drop
 *
 * @author Olivier Parent <olivier.parent@arteveldehs.be>
 * @copyright Copyright © 2015-2016, Artevelde University College Ghent
 */
class ArteveldeDatabaseDrop extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'artevelde:database:drop';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Drops database';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        // Get variables from `.env`
        $db_name = getenv('DB_DATABASE');
        $db_user = getenv('DB_USERNAME');
        $db_pass = getenv('DB_PASSWORD');

        // Drop database
        $sql = "DROP DATABASE IF EXISTS ${db_name}";
        $command = sprintf('MYSQL_PWD=%s mysql --user=%s --execute="%s"', $db_pass, $db_user, $sql);
        exec($command);

        $this->comment("Database `${db_name}` dropped!");
    }
}
