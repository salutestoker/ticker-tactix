<?php

namespace App\Support;

use App\Models\Module;
use App\Models\Playbook;
use App\Models\TraderType;

final class CatalogRichText
{
    /**
     * @param  iterable<int, Module>  $modules
     */
    public static function renderModules(iterable $modules): void
    {
        foreach ($modules as $module) {
            self::renderModule($module);
        }
    }

    /**
     * @param  iterable<int, Playbook>  $playbooks
     */
    public static function renderPlaybooks(iterable $playbooks): void
    {
        foreach ($playbooks as $playbook) {
            self::renderPlaybook($playbook);
        }
    }

    /**
     * @param  iterable<int, TraderType>  $traderTypes
     */
    public static function renderTraderTypeCatalog(iterable $traderTypes): void
    {
        foreach ($traderTypes as $traderType) {
            self::renderModules($traderType->modules ?? []);
            self::renderPlaybooks($traderType->playbooks ?? []);
        }
    }

    public static function renderModule(Module $module): Module
    {
        $module->setAttribute('description', RichText::render($module->description)->toHtml());
        $module->setAttribute('module_overview', RichText::render($module->module_overview)->toHtml());

        return $module;
    }

    public static function renderPlaybook(Playbook $playbook): Playbook
    {
        $playbook->setAttribute('long_description', RichText::render($playbook->long_description)->toHtml());

        return $playbook;
    }
}
