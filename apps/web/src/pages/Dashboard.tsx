function Dashboard() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-headline-lg text-on-surface">
          Dashboard
        </h1>
        <p className="mt-1 font-body text-body-md text-brand-neutral">
          Overview of your CRM activity
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-card">
          <p className="text-label-sm text-brand-neutral uppercase tracking-wide">Total Contacts</p>
          <p className="mt-2 font-heading text-headline-md text-on-surface">—</p>
        </div>
        <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-card">
          <p className="text-label-sm text-brand-neutral uppercase tracking-wide">Active Deals</p>
          <p className="mt-2 font-heading text-headline-md text-on-surface">—</p>
        </div>
        <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-card">
          <p className="text-label-sm text-brand-neutral uppercase tracking-wide">Pending Tasks</p>
          <p className="mt-2 font-heading text-headline-md text-on-surface">—</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
