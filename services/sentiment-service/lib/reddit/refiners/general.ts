import { BaseRefiner, BaseRefinerArgs } from "./base";

export interface GeneralRefinerStrategyArgs extends BaseRefinerArgs { };

export class GeneralRefinerStrategy extends BaseRefiner {
    constructor(args: GeneralRefinerStrategyArgs) {
        super(args);
    }
}