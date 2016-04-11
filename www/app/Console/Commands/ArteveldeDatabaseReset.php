<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

/**
 * Class ArteveldeDatabaseReset.
 *
 * Use:
 * $ php artisan artevelde:database:reset
 *
 * @author Olivier Parent <olivier.parent@arteveldehs.be>
 * @copyright Copyright © 2015-2016, Artevelde University College Ghent
 */
class ArteveldeDatabaseReset extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'artevelde:database:reset';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Drops and runs artevelde:database:init';

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

        // Drop database and initialize
        $this->callSilent('artevelde:database:drop');
        $this->callSilent('artevelde:database:init');

        $this->comment("Database `${dbName}` reset!");
    }
}
