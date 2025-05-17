import { useEffect, useState } from 'react';
import {
  getAllWorkoutClasses,
  createWorkoutClass,
  deleteWorkoutClass,
  updateWorkoutClass,
} from '../../../services/Api';
import {
  WorkoutClassDto,
  CreateWorkoutClassDto,
  UpdateWorkoutClassDto,
} from '../../../domain/client';
import { AppNavbar } from '../../../components/Navbar/Navbar';
import { AppButton } from '../../../components/Button/Button.component';
import { FormatDate } from '../../../utils/Date-utils';
import { format } from 'date-fns';

export function AdminCRUDPage() {
  const [workoutClasses, setWorkoutClasses] = useState<WorkoutClassDto[]>([]);
  const [form, setForm] = useState<CreateWorkoutClassDto>(
    new CreateWorkoutClassDto({
      workoutName: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(),
      maxParticipants: 0,
    })
  );

  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<UpdateWorkoutClassDto | null>(null);

  const startEdit = (workout: WorkoutClassDto) => {
    setEditId(workout.id!);
    setEditForm(
      new UpdateWorkoutClassDto({
        workoutName: workout.workoutName,
        description: workout.description,
        startDate: new Date(workout.startDate!),
        endDate: new Date(workout.endDate!),
        maxParticipants: workout.maxParticipants,
      })
    );
  };
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editForm) return;

    const { name, value } = e.target;
    const updatedValue =
      name === 'startDate' || name === 'endDate'
        ? new Date(value)
        : name === 'maxParticipants'
          ? parseInt(value)
          : value;

    setEditForm(
      prev =>
        new UpdateWorkoutClassDto({
          ...prev!,
          [name]: updatedValue,
        })
    );
  };
  const handleUpdate = async (id: number) => {
    if (!editForm) return;

    try {
      await updateWorkoutClass(id, editForm);
      alert('Träningspasset uppdaterades!');
      setEditId(null);
      setEditForm(null);
      loadWorkoutClasses();
    } catch (error) {
      console.error('Fel vid uppdatering:', error);
      alert('Kunde inte uppdatera passet.');
    }
  };

  useEffect(() => {
    loadWorkoutClasses();
  }, []);

  const loadWorkoutClasses = async () => {
    try {
      const data = await getAllWorkoutClasses();
      setWorkoutClasses(data);
    } catch (error) {
      console.error('Kunde inte ladda träningsklasser:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updatedValue =
      name === 'startDate' || name === 'endDate'
        ? new Date(value)
        : name === 'maxParticipants'
          ? parseInt(value)
          : value;

    setForm(prevForm => {
      const updated = new CreateWorkoutClassDto({
        ...prevForm,
        [name]: updatedValue,
      });
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createWorkoutClass(form);
      alert('Träningspass skapat!');
      loadWorkoutClasses();

      setForm(
        new CreateWorkoutClassDto({
          workoutName: '',
          description: '',
          startDate: new Date(),
          endDate: new Date(),
          maxParticipants: 0,
        })
      );
    } catch (error) {
      console.error('Fel vid skapande:', error);
      alert('Något gick fel.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Är du säker på att du vill ta bort passet?')) return;

    try {
      await deleteWorkoutClass(id);
      alert('Passet har tagits bort.');
      loadWorkoutClasses();
    } catch (error) {
      console.error('Fel vid borttagning:', error);
      alert('Kunde inte ta bort passet.');
    }
  };

  return (
    <div className="custom-page">
      <AppNavbar />
      <div className="container mt-4">
        <h2>Admin - Skapa Träningspass</h2>

        <form onSubmit={handleSubmit} className="mb-4 col-md-6">
          <div className="mb-3">
            <label className="form-label">Namn</label>
            <input
              type="text"
              name="workoutName"
              value={form.workoutName}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Beskrivning</label>
            <textarea
              name="description"
              value={form.description || ''}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Starttid</label>
            <input
              type="datetime-local"
              name="startDate"
              value={format(form.startDate, "yyyy-MM-dd'T'HH:mm")}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Sluttid</label>
            <input
              type="datetime-local"
              name="endDate"
              value={format(form.endDate, "yyyy-MM-dd'T'HH:mm")}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Max antal deltagare</label>
            <input
              type="number"
              name="maxParticipants"
              value={form.maxParticipants ?? 0}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <AppButton type="submit">Skapa Pass</AppButton>
        </form>

        <h4>Befintliga Träningspass</h4>
        <ul className="list-group mb-5">
          {workoutClasses.map(
            c =>
              c.id !== undefined && (
                <li
                  key={c.id}
                  className="list-group-item d-flex flex-column align-items-start">
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <div>
                      <strong>{c.workoutName}</strong> –{' '}
                      {FormatDate(c.startDate, c.endDate)} ({c.maxParticipants}{' '}
                      platser)
                    </div>
                    <div className="btn-group">
                      <AppButton
                        variant="cancel"
                        onClick={() => handleDelete(c.id!)}>
                        Ta bort
                      </AppButton>
                      <AppButton variant="default" onClick={() => startEdit(c)}>
                        Ändra
                      </AppButton>
                    </div>
                  </div>

                  {editId === c.id && editForm && (
                    <form
                      className="mt-3 w-100"
                      onSubmit={e => {
                        e.preventDefault();
                        handleUpdate(c.id!);
                      }}>
                      <div className="mb-2">
                        <label>Namn</label>
                        <input
                          type="text"
                          name="workoutName"
                          value={editForm.workoutName || ''}
                          onChange={handleEditChange}
                          className="form-control"
                        />
                      </div>
                      <div className="mb-2">
                        <label>Beskrivning</label>
                        <textarea
                          name="description"
                          value={editForm.description || ''}
                          onChange={handleEditChange}
                          className="form-control"
                        />
                      </div>
                      <div className="mb-2">
                        <label>Startdatum</label>
                        <input
                          type="datetime-local"
                          name="startDate"
                          value={
                            editForm.startDate
                              ? editForm.startDate.toISOString().slice(0, 16)
                              : ''
                          }
                          onChange={handleEditChange}
                          className="form-control"
                        />
                      </div>
                      <div className="mb-2">
                        <label>Slutdatum</label>
                        <input
                          type="datetime-local"
                          name="endDate"
                          value={
                            editForm.endDate
                              ? editForm.endDate.toISOString().slice(0, 16)
                              : ''
                          }
                          onChange={handleEditChange}
                          className="form-control"
                        />
                      </div>
                      <div className="mb-3">
                        <label>Max antal deltagare</label>
                        <input
                          type="number"
                          name="maxParticipants"
                          value={editForm.maxParticipants || 0}
                          onChange={handleEditChange}
                          className="form-control"
                        />
                      </div>
                      <div className="btn-group">
                        <AppButton variant="default" type="submit">
                          Spara ändringar
                        </AppButton>
                        <AppButton
                          variant="cancel"
                          onClick={() => setEditId(null)}>
                          Avbryt
                        </AppButton>
                      </div>
                    </form>
                  )}
                </li>
              )
          )}
        </ul>
      </div>
    </div>
  );
}
