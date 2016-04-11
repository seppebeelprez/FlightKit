<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

/**
 * Class ArteveldeDatabaseBackup.
 *
 * Use:
 * $ php artisan artevelde:database:backup
 *
 * @author Olivier Parent <olivier.parent@arteveldehs.be>
 * @copyright Copyright © 2015-2016, Artevelde University College Ghent
 */
class ArteveldeDatabaseBackup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'artevelde:database:backup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Dumps database to SQL file for backup';

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

        // Create folder(s)
        $command = "mkdir -p ${dbDumpPath}";
        exec($command);

        // Create SQL database dump
        $command = "MYSQL_PWD=${dbPassword} mysqldump --user=${dbUsername} --databases ${dbName} > ${dbDumpPath}/latest.sql";
        exec($command);

        // Gzip and timestamp created SQL database dump
        $command = "gzip -cr ${dbDumpPath}/latest.sql > ${dbDumpPath}/$(date +\"%Y-%m-%d_%H%M%S\").sql.gz";
        exec($command);

        $this->comment("Backup for database `${dbName}` stored!");
    }
}
