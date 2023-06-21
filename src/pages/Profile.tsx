import { Component, createSignal } from 'solid-js';
import { pencilSquare, check } from 'solid-heroicons/outline';
import { Icon } from 'solid-heroicons';
import { useAuthStore } from '../store/authStore';
import AdminIcon from '../components/AdminIcon';
import EditableText from '../components/EditableText';

const Profile: Component<{}> = (props) => {
  const { auth } = useAuthStore((state) => ({
    auth: state.auth
  }));
  const [editedUsername, setEditedUsername] = createSignal<string>(
    auth?.username || 'none'
  );
  const [willEdit, setWillEdit] = createSignal<boolean>(false);

  const handleEdit = async () => {
    setWillEdit((willEdit) => !willEdit);
  };

  return (
    <div class="m-2 border w-full rounded border-slate-400 border-dashed p-4">
      <h1 class="lg:text-5xl text-4xl font-bold mb-1">Perfil</h1>
      <hr />
      <div class='grid grid-cols-3 px-4 py-8'>
        <div>
            <AdminIcon user={auth?.username} icon='#000' size='250px'/>
            <input type="color" />
        </div>
        <div class=''>
          <h2 class='text-xl font-bold'>Nombre de usuario</h2>
            <EditableText class='text-lg' val={editedUsername()} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
