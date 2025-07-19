<?php

use BitApps\Social\CLI\DatabaseCommands;
use BitApps\Social\CLI\PluginCommands;
use BitApps\Social\Config;

if (defined('WP_CLI') && WP_CLI) {
    WP_CLI::add_command(Config::SLUG . ' db', new DatabaseCommands());
    WP_CLI::add_command(Config::SLUG . ' use', new PluginCommands());
}
