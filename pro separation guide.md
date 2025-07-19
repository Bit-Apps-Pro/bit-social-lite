## Pro Separation Guide

### How to Separate Free and Pro code.

To separate free and pro code, you need to separate the code into two different files. For example, you can create a file called `Feature.tsx` and `Feature.pro.tsx` and then import the both files in the main file. When calling the feature, you can check if the user is a pro user or not.

#### ✅ (Do's) Example for, `.tsx` file:

```tsx
import FeatureFree from './Feature.free'
import FeaturePro from './Feature.pro'
import isPro from '@/src/commons/helpers/isPro'

const YourComponent = () => {
  const isPro = isPro() // Check if the user is a pro user or not

  return (
    <div>
      ...
      {isPro ? <FeaturePro /> : <FeatureFree />}
      ...
    </div>
  )
}
```

#### ✅ (Do's) Example for, `.ts` file:

```ts
import { utilFunctionFree } from './utils.free'
import { utilFunctionPro } from './utils.pro'
import isPro from '@/src/commons/helpers/isPro'

...
const yourFunction = () => {
  ...
  const result = isPro() ? utilFunctionPro() : utilFunctionFree()
  ...
}
...

or inside component

const YourComponent = () => {
  const result = isPro() ? utilFunctionPro() : utilFunctionFree()
  return (
    <div>
      ...
    </div>
  )
}
```

---

Avoid pro checking in the same file. Instead, create a separate file for pro code and import it in the main file.

#### ❌ (Don't) Example for, `.tsx` file:

```tsx
export const YourComponent = () => {
  const isPro = isPro()

  return (
    <div>
      {isPro ? (
        <div>
          <ul>
            <li>list item 1</li>
            <li>list item 2</li>
            <li>list item 4</li>
            ...
          </ul>
        </div>
      ) : (
        <div>
          <ul>
            <li>free list item 1</li>
            <li>free list item 2</li>
            <li>free list item 3</li>
            ...
          </ul>
        </div>
      )}
    </div>
  )
}
```

✔️ In the above example, the pro checking is done in the same file. Instead, create a separate file for pro code and import it in the main file. Please avoid this and follow the do's example.

#### ❌ (Don't) Example for, `.ts` file:

```ts
export const yourFunction = arr => {
  const isPro = isPro()

  const result = false

  if (isPro) {
    result = arr.map(item => item * 2)
    // pro code
  } else {
    result = arr.map(item => item * 3)
    // free code
  }
}
```

✔️ In the above example, the pro checking is done in the same file and function (yourFunction). Instead, create a separate file for pro code and import it in the main file. Please avoid this and follow the do's example.
