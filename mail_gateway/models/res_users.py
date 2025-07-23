# Copyright 2024 Dixmit
# License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).

from odoo import fields, models


class ResUsers(models.Model):
    _inherit = "res.users"

    gateway_ids = fields.Many2many("mail.gateway")

    def _init_messaging(self, store):
        """Extend messaging initialization to inject gateway info.

        Starting from Odoo 18.0 ``_init_messaging`` receives a ``store``
        object where data must be added using :py:meth:`store.add` instead of
        returning a dict.  This overrides the upstream implementation while
        preserving compatibility with the new signature.
        """
        result = super()._init_messaging(store)
        store.add({"gateways": self.gateway_ids.gateway_info()})
        return result
