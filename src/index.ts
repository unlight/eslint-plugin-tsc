import { config } from './config';
import { Rule } from 'eslint';

type RuleDict = { [id: string]: Rule.RuleModule | ((context: Rule.RuleContext) => Rule.RuleListener) };

export const rules: RuleDict = {
    config,
};
