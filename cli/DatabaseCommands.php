<?php

namespace BitApps\Social\CLI;

use BitApps\Social\Config;
use BitApps\Social\Deps\BitApps\WPKit\Migration\MigrationHelper;
use BitApps\Social\Providers\InstallerProvider;
use Throwable;
use WP_CLI;

class DatabaseCommands
{
    public function migration($_, $assocArgs)
    {
        if (empty($assocArgs['table'])) {
            WP_CLI::error('missing table name parameter use wp bit-social db migration --table=table name');

            return;
        }

        $tableName = $assocArgs['table'];
        $camelCaseString = str_replace('_', '', ucwords($tableName, '_'));
        $className = Config::CLASS_PREFIX . $camelCaseString . 'TableMigration';

        $migrationContent
= "<?php

use BitApps\Social\Deps\BitApps\WPDatabase\Blueprint;
use BitApps\Social\Deps\BitApps\WPDatabase\Schema;
use BitApps\Social\Deps\BitApps\WPKit\Migration\Migration;
        
if (!defined('ABSPATH')) {
    exit;
}
        
final class {$className} extends Migration
{
    public function up(): void
    {
        Schema::create(
            '{$tableName}',
            function (Blueprint \$table): void {
                \$table->id();
                \$table->timestamps();
            }
        );
    }
    
    public function down(): void
    {
        Schema::drop('{$tableName}');
    }
}
";
        $fileName = Config::CLASS_PREFIX . $camelCaseString . 'TableMigration.php';
        $path = Config::get('BASEDIR')
        . DIRECTORY_SEPARATOR
        . 'db'
        . DIRECTORY_SEPARATOR
        . 'Migrations'
        . DIRECTORY_SEPARATOR;

        file_put_contents($path . $fileName, $migrationContent);

        WP_CLI::success('Table created successfully');
    }

    public function drop()
    {
        try {
            MigrationHelper::drop(InstallerProvider::drop());

            WP_CLI::success('Database drop successfully !');
        } catch (Throwable $th) {
            WP_CLI::error('Error, ' . $th . '!');
        }
    }

    public function fresh()
    {
        try {
            MigrationHelper::drop(InstallerProvider::drop());
            MigrationHelper::migrate(InstallerProvider::migration());

            WP_CLI::success('Database fresh successfully !');
        } catch (Throwable $th) {
            WP_CLI::error('Error, ' . $th . '!');
        }
    }

    public function migrate()
    {
        try {
            MigrationHelper::migrate(InstallerProvider::migration());

            WP_CLI::success('Database migrate successfully !');
        } catch (Throwable $th) {
            WP_CLI::success('Error, ' . $th . '!');
        }
    }
}
