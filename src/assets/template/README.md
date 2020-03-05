# FIRE.evley.app CSV Data Template


### Data format
The above headers, with their data format is expected to correctly calculate metrics. However, how you decide they data is represented is up to you. For example, should you class a savings account with an income as well as an expenditure and asset, you can.

| Header | Type | Description |
| :--- | :--- | :--- |
| Name | `string` | The name of the item you are adding. Helpful to be as descriptive as you feel you need to understand what this item is once hovered |
| Image | `string` | An external image URL is expected here. It'll simply be used to identify the items easier on the chart. Feel free to use the relevant company logo or something similar |
| Icon | `string` | Simular to image besides we'd want an icon name from the [Material icon set](https://material.io/resources/icons/?style=baseline). For example: `home` or `fastfood` |
| Essential | `boolean (1/0)`  | Is this item essential to you? This is an important flag as it determins which items will persist after you achieve FIRE. Therefore, essential expenses are used to calculate your FIRE requirement and in turn, your FIRE time. P.s. use `1` for true or `0` for false. If it's essential, pop a `1` in there |
| Income | `number` | Does this line item has an income? For example, your salary (after tax) |
| Expenditure | `number` | Does this line item has an expenditure? For example, this could be your mortgage or food |
| Liability | `number` | Does this line item has a liability? For example, this could be a credit card or loan |
| Assets | `number` | Does this line item has an asset value? For example, this could be an investment account or savings account |


### Example CSV

An [example CSV](https://github.com/evley/fire/tree/master/src/assets/template/example.csv) to download, edit, and upload.
