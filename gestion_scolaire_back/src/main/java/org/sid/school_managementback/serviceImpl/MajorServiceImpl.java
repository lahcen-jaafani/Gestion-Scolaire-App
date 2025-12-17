package org.sid.school_managementback.serviceImpl;

import org.modelmapper.ModelMapper;
import org.sid.school_managementback.DTO.MajorDto;
import org.sid.school_managementback.DTO.MajorStudentCountDTO;
import org.sid.school_managementback.Repository.DepartementRepository;
import org.sid.school_managementback.Repository.MajorRepository;
import org.sid.school_managementback.Repository.ProfRepository;

import org.sid.school_managementback.entity.Departement;
import org.sid.school_managementback.entity.Major;
import org.sid.school_managementback.entity.User;
import org.sid.school_managementback.exception.ResourceNotFoundException;
import org.sid.school_managementback.mapper.MajorMapper;
import org.sid.school_managementback.service.MajorService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MajorServiceImpl extends GenericServiceImpl<Major, MajorDto, Long> implements MajorService {
    private final ProfRepository professorRepository;
    private final ModelMapper modelMapper;
    private final MajorRepository majorRepository;
    private final MajorMapper majorMapper;
    private final DepartementRepository departementRepository;
    private final ProfRepository userRepository;

    public MajorServiceImpl(
            ProfRepository professorRepository, ModelMapper modelMapper, MajorRepository majorRepository,
            MajorMapper majorMapper,
            DepartementRepository departementRepository,
            ProfRepository userRepository
    ) {
        super(majorRepository, majorMapper);
        this.professorRepository = professorRepository;
        this.modelMapper = modelMapper;
        this.majorRepository = majorRepository;
        this.majorMapper = majorMapper;
        this.departementRepository = departementRepository;
        this.userRepository = userRepository;
    }

    public MajorDto createMajor(String name, String contenu, MultipartFile file, Long departementId, Long chefId) {
        try {
            // 1. Créer le dossier temporaire pour stocker les PDF
            String uploadDir = System.getProperty("java.io.tmpdir") + "/uploads/pdf/";
            File uploadDirFile = new File(uploadDir);
            if (!uploadDirFile.exists()) {
                uploadDirFile.mkdirs();
            }

            // 2. Gérer le fichier PDF s’il est fourni
            String fileName = null;
            String filePath = null;
            if (file != null && !file.isEmpty()) {
                fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                File destinationFile = new File(uploadDir + fileName);
                file.transferTo(destinationFile);
                filePath = destinationFile.getAbsolutePath();
            }

            // 3. Création de l’objet Major
            Major major = new Major();
            major.setNAME(name);
            major.setContenu(contenu);
            major.setDateCreation(LocalDateTime.now());
            major.setPdfFilename(fileName);
            major.setPdfPath(filePath);
            major.setChef(professorRepository.findById(chefId).get());

            // 4. Lier au Département
            Departement departement = departementRepository.findById(departementId)
                    .orElseThrow(() -> new RuntimeException("Département introuvable avec ID: " + departementId));
            major.setDepartement(departement);

            // 5. Lier au chef si fourni
            if (chefId != null) {
                User chef = userRepository.findById(chefId)
                        .orElseThrow(() -> new RuntimeException("Chef de filière introuvable avec ID: " + chefId));

            }

            // 6. Sauvegarder
            Major saved = majorRepository.save(major);

            // 7. Retourner le DTO
            return majorMapper.toDto(saved);
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors du téléchargement du fichier PDF", e);
        }
    }
         @Override
       public List<MajorStudentCountDTO> getStudentCountPerMajor(String year) {
           return majorRepository.countStudentsByMajorAndYear(year);
            }
    @Override
    public Major getEntityById(Long id) {
        return null;
    }

    @Override
    public List<MajorDto> getMajorsByDepartementId(Long departementId) {
        List<Major> majors = majorRepository.findByDepartementId(departementId);
        return majors.stream()
                .map(majorMapper::toDto)
                .collect(Collectors.toList());
    }
    @Override
    public List<MajorDto> getMajorsByProfessor(Long professorId) {
        // Verify professor exists first
        professorRepository.findById(professorId)
                .orElseThrow(() -> new ResourceNotFoundException("Professor not found with id: " + professorId));

        // Get majors where professor teaches
        List<Major> majors = majorRepository.findByProfessorId(professorId);

        if (majors.isEmpty()) {
            return Collections.emptyList();
        }

        return majors.stream()
                .map(major -> modelMapper.map(major, MajorDto.class))
                .collect(Collectors.toList());
    }

    @Override
    protected void setEntityId(Major entity, Long aLong) {

    }
}
