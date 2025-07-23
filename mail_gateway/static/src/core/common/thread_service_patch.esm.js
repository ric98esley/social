/* @odoo-module */

// ThreadService no longer exists in Odoo 18.0. The required hooks are now
// handled in the Store service. This patch re-implements the previous
// behaviour on top of the new API while keeping the gateway features.

import {Store} from "@mail/core/common/store_service";
import {patch} from "@web/core/utils/patch";

patch(Store.prototype, {
    /**
     * Extend message post params to forward gateway notifications.
     *
     * @override
     */
    async getMessagePostParams(params) {
        const result = await super.getMessagePostParams(...arguments);
        if (params.thread?.gateway_notifications) {
            // Ensure the nested structures exist before assignment
            result.post_data = result.post_data || {};
            result.post_data.gateway_notifications =
                params.thread.gateway_notifications;
        }
        return result;
    },
});
