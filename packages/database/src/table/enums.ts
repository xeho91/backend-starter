import { Currency } from "@packages/core/currency";
import { OrderStatus } from "@packages/core/order-status";
import { UserRole } from "@packages/core/user-role";
import { pgEnum } from "drizzle-orm/pg-core/columns/enum";

export const ENUM_CURRENCY = pgEnum("currency", Currency.ENUM);
export const ENUM_ORDER_STATUS = pgEnum("order_status", OrderStatus.ENUM);
export const ENUM_USER_ROLE = pgEnum("user_role", UserRole.ENUM);
