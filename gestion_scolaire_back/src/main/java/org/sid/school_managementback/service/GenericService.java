package org.sid.school_managementback.service;

import java.util.List;

public interface GenericService<D, ID> {
    D save(D dto);
    D findById(ID id);
    List<D> findAll();
    void delete(ID id);
    D update(ID id, D dto);
}