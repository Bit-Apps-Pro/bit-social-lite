<?php

namespace BitApps\Social\CLI;

use BitApps\Social\Config;
use BitApps\Social\Dotenv;
use WP_CLI;

class PluginCommands
{
    public const PRO_PLUGIN_INDEX = Config::PRO_PLUGIN_SLUG . '/' . Config::PRO_PLUGIN_SLUG . '.php';

    public const DEV = 'DEV';

    public const PRO_PLUGIN = 'PRO_PLUGIN';

    public function enablePro()
    {
        $sourceDirectory = realpath(__DIR__ . DIRECTORY_SEPARATOR . '../pro');

        $destinationDirectory = WP_PLUGIN_DIR . DIRECTORY_SEPARATOR . Config::PRO_PLUGIN_SLUG;

        if (!file_exists($sourceDirectory)) {
            WP_CLI::error('Source directory not found!');
        }

        if (!file_exists($destinationDirectory)) {
            $this->createSymlink($sourceDirectory, $destinationDirectory);
        }

        $isActivated = shell_exec('wp plugin activate ' . Config::PRO_PLUGIN_SLUG);

        if (!$isActivated) {
            WP_CLI::error('Plugin activate error!');
        }

        WP_CLI::success('The pro plugin is now active !');
    }

    public function disablePro()
    {
        $proPluginDir = WP_PLUGIN_DIR . DIRECTORY_SEPARATOR . Config::PRO_PLUGIN_SLUG;

        if (file_exists($proPluginDir) && is_plugin_active(self::PRO_PLUGIN_INDEX)) {
            $isDeactivated = shell_exec('wp plugin deactivate ' . Config::PRO_PLUGIN_SLUG);

            if (!$isDeactivated) {
                WP_CLI::error('Plugin deactivate error!');
            }
        }
        WP_CLI::success('Only free plugin is active !');
    }

    public function toggleDev($_, $assocArgs)
    {
        if (!isset($assocArgs['active'])) {
            WP_CLI::error('missing parameter use wp social use toggleDev --active=y|n');

            return;
        }

        $flag = strtolower($assocArgs['active']) === 'y' ? true : false;

        Dotenv::setEnv(self::DEV, $flag);

        WP_CLI::success(sprintf('The %s constant is %s.', self::DEV, $flag ? 'Enable' : 'Disable'));
    }

    public function createSymlink($source, $destination)
    {
        $isLinuxOS = strtoupper(substr(PHP_OS, 0, 3)) === 'LIN';
        if ($isLinuxOS) {
            $symlinkStatus = symlink($source, $destination);
            if (!$symlinkStatus) {
                WP_CLI::error('Symlink creation error!' . $symlinkStatus);
            }
        } else {
            shell_exec("cd bin && run-command-as-admin.bat node ../scripts/create-symlink.js {$source} {$destination}");
        }
    }
}
