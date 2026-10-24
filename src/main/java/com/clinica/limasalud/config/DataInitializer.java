package com.clinica.limasalud.config;

import com.clinica.limasalud.entity.HorarioMedico;
import com.clinica.limasalud.entity.Paciente;
import com.clinica.limasalud.dto.PacienteForm;
import com.clinica.limasalud.entity.Rol;
import com.clinica.limasalud.entity.ServicioMedico;
import com.clinica.limasalud.entity.Usuario;
import com.clinica.limasalud.repository.HorarioMedicoRepository;
import com.clinica.limasalud.repository.ServicioMedicoRepository;
import com.clinica.limasalud.repository.UsuarioRepository;
import com.clinica.limasalud.service.ClinicaService;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Inicializador de datos de prueba para entornos de desarrollo y pruebas.
 * Restringido a perfiles no productivos (!prod) para evitar inyeccion de cuentas predeterminadas en producción.
 */
@Configuration
@Profile("!prod")
public class DataInitializer {

    @Bean
    CommandLineRunner cargarDatosIniciales(
            UsuarioRepository usuarioRepository,
            ServicioMedicoRepository servicioRepository,
            HorarioMedicoRepository horarioRepository,
            ClinicaService clinicaService,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (servicioRepository.count() > 0) {
                return;
            }

            ServicioMedico cardiologia = guardarServicio(servicioRepository,
                    "cardiologia", "Cardiologia",
                    "Prevencion, diagnostico y control de enfermedades cardiovasculares.",
                    "bi-heart-pulse", "/images/cardiologia.jpg");
            ServicioMedico pediatria = guardarServicio(servicioRepository,
                    "pediatria", "Pediatria",
                    "Atencion integral para ninos y adolescentes.",
                    "bi-person-hearts", "/images/pediatria.jpg");
            ServicioMedico traumatologia = guardarServicio(servicioRepository,
                    "traumatologia", "Traumatologia",
                    "Evaluacion y recuperacion de lesiones oseas, musculares y articulares.",
                    "bi-bandaid", "/images/traumatologia.jpg");
            ServicioMedico neurologia = guardarServicio(servicioRepository,
                    "neurologia", "Neurologia",
                    "Atencion especializada del sistema nervioso y dolores neurologicos.",
                    "bi-activity", "/images/neurologia.jpg");

            List<HorarioMedico> horarios = List.of(
                    new HorarioMedico("cardio-perez-lunes-0800", cardiologia, "Dr. Perez Rodriguez", "Lunes", "08:00", "Presencial"),
                    new HorarioMedico("cardio-perez-miercoles-1000", cardiologia, "Dr. Perez Rodriguez", "Miercoles", "10:00", "Presencial"),
                    new HorarioMedico("cardio-lopez-jueves-1500", cardiologia, "Dra. Lopez Vargas", "Jueves", "15:00", "Presencial"),
                    new HorarioMedico("pedia-torres-lunes-0700", pediatria, "Dra. Torres Quispe", "Lunes", "07:00", "Presencial"),
                    new HorarioMedico("pedia-mamani-viernes-1000", pediatria, "Dr. Mamani Flores", "Viernes", "10:00", "Telemedicina"),
                    new HorarioMedico("trauma-caceres-lunes-0900", traumatologia, "Dr. Caceres Huanca", "Lunes", "09:00", "Presencial"),
                    new HorarioMedico("neuro-salas-martes-1000", neurologia, "Dra. Salas Mendoza", "Martes", "10:00", "Presencial"),
                    new HorarioMedico("neuro-salas-viernes-0800", neurologia, "Dra. Salas Mendoza", "Viernes", "08:00", "Telemedicina")
            );
            horarioRepository.saveAll(horarios);

            Paciente juan = registrarPaciente(clinicaService, "Juan Perez", "72635441", 35, "Titular", "987654321", "juan@mail.com");
            Paciente maria = registrarPaciente(clinicaService, "Maria Lopez", "10293847", 29, "Titular", "912345678", "maria@mail.com");
            Paciente ricardo = registrarPaciente(clinicaService, "Ricardo Soto", "44556677", 48, "Titular", "999888777", "soto@mail.com");
            Paciente ana = registrarPaciente(clinicaService, "Ana Torres", "88776655", 41, "Titular", "954123987", "ana@mail.com");

            clinicaService.registrarCita(juan.getId(), "cardio-perez-lunes-0800");
            clinicaService.registrarCita(maria.getId(), "pedia-torres-lunes-0700");
            clinicaService.registrarCita(ricardo.getId(), "trauma-caceres-lunes-0900");
            clinicaService.registrarCita(ana.getId(), "neuro-salas-martes-1000");

            if (usuarioRepository.count() == 0) {
                usuarioRepository.save(crearUsuario(passwordEncoder, "medico", "Medico2026!", "Medico Demo", "medico@limasalud.pe", Rol.MEDICO, null));
                usuarioRepository.save(crearUsuario(passwordEncoder, "admin", "Admin2026!", "Administrador Demo", "admin@limasalud.pe", Rol.ADMIN, null));
                usuarioRepository.save(crearUsuario(passwordEncoder, "paciente", "Paciente2026!", "Juan Perez", "juan@mail.com", Rol.PACIENTE, juan));
            }
        };
    }

    private static ServicioMedico guardarServicio(
            ServicioMedicoRepository repository,
            String id,
            String nombre,
            String descripcion,
            String icono,
            String imagen
    ) {
        return repository.save(new ServicioMedico(id, nombre, descripcion, icono, imagen, true));
    }

    private static Paciente registrarPaciente(
            ClinicaService clinicaService,
            String nombre,
            String dni,
            int edad,
            String parentesco,
            String telefono,
            String correo
    ) {
        PacienteForm form = new PacienteForm();
        form.setNombreCompleto(nombre);
        form.setDni(dni);
        form.setEdad(edad);
        form.setParentesco(parentesco);
        form.setTelefono(telefono);
        form.setCorreo(correo);
        return clinicaService.registrarPaciente(form);
    }

    private static Usuario crearUsuario(
            PasswordEncoder passwordEncoder,
            String username,
            String password,
            String nombre,
            String correo,
            Rol rol,
            Paciente paciente
    ) {
        Usuario usuario = new Usuario();
        usuario.setUsername(username);
        usuario.setPasswordHash(passwordEncoder.encode(password));
        usuario.setNombreCompleto(nombre);
        usuario.setCorreo(correo);
        usuario.setRol(rol);
        usuario.setPaciente(paciente);
        return usuario;
    }
}
