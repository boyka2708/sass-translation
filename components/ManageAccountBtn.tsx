import { generatePortalLink } from '@/actions/GeneratePortalLink';


type Props = {}

 function ManageAccountBtn({}: Props) {
  return (
    <form action={generatePortalLink}>
        <button type='submit'>Manage Billing</button>
    </form>
  )
}

export default ManageAccountBtn