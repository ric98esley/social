/* @odoo-module */
import {reactive} from "@odoo/owl";
import {registry} from "@web/core/registry";

export class GatewayCoreWeb {
    constructor(env, services) {
        this.busService = services.bus_service;
        /** @type {import("@mail/core/common/store_service").Store} */
        this.store = services["mail.store"];
    }
    setup() {
        // Esperar a que el Store haya terminado de cargar la mensajería
        this.store.isReady.then(() => {
            if (this.store.settings?.is_discuss_sidebar_category_gateway_open) {
                this.store.discuss.gateway.isOpen = true;
            }
            this.busService.subscribe("res.users.settings", (payload) => {
                if (payload) {
                    this.store.discuss.gateway.isOpen =
                        payload.is_discuss_sidebar_category_gateway_open ??
                        this.store.discuss.gateway.isOpen;
                }
            });
        });
    }
}

export const gatewayCoreWeb = {
    dependencies: ["bus_service", "mail.store"],
    start(env, services) {
        const gw = reactive(new GatewayCoreWeb(env, services));
        gw.setup();
        return gw;
    },
};

registry.category("services").add("mail_gateway.core.web", gatewayCoreWeb);
