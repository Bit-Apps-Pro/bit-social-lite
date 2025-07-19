import css from './AccountLoaderSkeleton.module.css'

interface AccountLoaderSkeletonType {
  accountQuantity: number
}

export default function AccountLoaderSkeleton({ accountQuantity }: AccountLoaderSkeletonType) {
  const AccountList = Array.from({ length: accountQuantity }).fill(0)
  return (
    <div className={css.accountLoaderSection}>
      {AccountList.map((_, index) => (
        <div className={`${css.accountLoader} loader`} key={`loader-${index * 2}`} />
      ))}
    </div>
  )
}
