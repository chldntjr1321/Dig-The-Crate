const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-page flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
    </div>
  )
}

export default LoadingSpinner
