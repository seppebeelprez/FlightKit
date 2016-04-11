<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

/**
 * Class ArteveldeDatabaseRestore.
 *
 * Use:
 * $ php artisan artevelde:database:restore
 *
 * @author Olivier Parent <olivier.parent@arteveldehs.be>
 * @copyright Copyright © 2015-2016, Artevelde University College Ghent
 */
class ArteveldeDatabaseRestore extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'artevelde:database:restore';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Restores database from latest SQL dump';

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
        $dbName = getenv('DB_DATABASE');
        $dbUsername = getenv('DB_USERNAME');
        $dbPassword = getenv('DB_PASSWORD');
        $dbDumpPath = getcwd().'/'.getenv('DB_DUMP_PATH');

        // Reset database
        $this->callSilent('artevelde:database:reset');

        // Restore SQL dump
        $command = "MYSQL_PWD=${dbPassword} mysql --user=${dbUsername} ${dbName} < ${dbDumpPath}/latest.sql";
        exec($command);

        $this->comment("Backup for database `${dbName}` restored!");
    }
}
