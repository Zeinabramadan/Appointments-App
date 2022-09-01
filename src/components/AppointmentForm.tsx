import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@material-ui/core/Button';
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
} from '@material-ui/core';

import { getPractitioners, practitionersSelectors } from 'store/practitioners';
import { getPatients, patientsSelectors } from 'store/patients';
import { createAppointment, getAppointments } from 'store/appointments';
import { REQUIRED_FIELDS } from './data';

import {
  getAvailabilities,
  availabilitiesSelectors,
} from 'store/availabilities';
import { Availability, Patient, Practitioner } from '@prisma/client';
import { formatDate, formatTime } from 'utils/date';

const validationSchema = yup.object({
  practitionerId: yup.string().required(REQUIRED_FIELDS.practitioner),
  patientId: yup.string().required(REQUIRED_FIELDS.patient),
  startDate: yup.string().required(REQUIRED_FIELDS.startDate),
  endDate: yup.string().required(REQUIRED_FIELDS.endDate),
});

const AppointmentForm = () => {
  const dispatch = useDispatch();
  const practitioners = useSelector((state) =>
    practitionersSelectors.selectAll(state.practitioners),
  );
  const patients = useSelector((state) =>
    patientsSelectors.selectAll(state.patients),
  );

  const availabilities = useSelector((state) =>
    availabilitiesSelectors.selectAll(state.availabilities),
  );

  const formik = useFormik({
    initialValues: {
      practitionerId: '',
      startDate: '',
      endDate: '',
      patientId: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(createAppointment(JSON.stringify(values)));
      dispatch(getAppointments());
    },
  });

  useEffect(() => {
    dispatch(getPatients());
    dispatch(getPractitioners());
  }, []);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container>
        <Grid item md={3} sm={6}>
          <FormControl style={{ marginBottom: '20px' }}>
            <InputLabel id="patient">Patient</InputLabel>
            <Select
              value={formik.values.patientId}
              labelId="patient"
              onChange={formik.handleChange}
              style={{ width: '200px' }}
              name="patientId"
              label="patient"
              id="patient"
              error={
                formik.touched.patientId && Boolean(formik.errors.patientId)
              }
            >
              {patients.map((patient: Patient) => (
                <MenuItem key={patient.id} value={patient.id}>
                  {patient.firstName}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {formik.touched.patientId && formik.errors.patientId}
            </FormHelperText>
          </FormControl>
          <FormControl style={{ marginBottom: '20px' }}>
            <InputLabel id="practitioner">Practitioner</InputLabel>
            <Select
              value={formik.values.practitionerId}
              labelId="practitioner"
              onChange={(e) => {
                formik.handleChange(e);
                dispatch(getAvailabilities(e.target.value));
              }}
              style={{ width: '200px' }}
              name="practitionerId"
              label="practitioner"
              id="practitioner"
              error={
                formik.touched.practitionerId &&
                Boolean(formik.errors.practitionerId)
              }
            >
              {practitioners.map((practitioner: Practitioner) => (
                <MenuItem key={practitioner.id} value={practitioner.id}>
                  {practitioner.firstName}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {formik.touched.practitionerId && formik.errors.practitionerId}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item md={3} sm={6}>
          {availabilities.length > 0 && (
            <FormControl style={{ marginBottom: '20px' }}>
              <InputLabel id="startDate">From: </InputLabel>
              <Select
                label="startDate"
                id="startDate"
                labelId="startDate"
                value={formik.values.startDate}
                onChange={formik.handleChange}
                style={{ width: '200px' }}
                name="startDate"
                error={
                  formik.touched.startDate && Boolean(formik.errors.startDate)
                }
              >
                {availabilities.map((availability: Availability) => (
                  <MenuItem
                    key={availability.id}
                    value={availability.startDate}
                  >
                    {formatDate(availability.startDate)}{' '}
                    {formatTime(availability.startDate)}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {formik.touched.startDate && formik.errors.startDate}
              </FormHelperText>
            </FormControl>
          )}
          {availabilities.length > 0 && (
            <FormControl style={{ marginBottom: '20px' }}>
              <InputLabel id="endDate">To: </InputLabel>
              <Select
                label="endDate"
                id="endDate"
                labelId="endDate"
                value={formik.values.endDate}
                onChange={formik.handleChange}
                style={{ width: '200px' }}
                name="endDate"
                error={formik.touched.endDate && Boolean(formik.errors.endDate)}
              >
                {availabilities.map((availability: Availability) => (
                  <MenuItem key={availability.id} value={availability.endDate}>
                    {formatDate(availability.endDate)}{' '}
                    {formatTime(availability.endDate)}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {formik.touched.endDate && formik.errors.endDate}
              </FormHelperText>
            </FormControl>
          )}
        </Grid>
        <Grid item md={12} sm={12}>
          <Button
            style={{ marginTop: '20px' }}
            color="primary"
            variant="contained"
            type="submit"
            disabled={!formik.dirty || !formik.isValid}
          >
            Book
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AppointmentForm;
